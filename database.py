import mysql.connector
import helper
import json


class NamesUnitOfWork:

    def __init__(self):
        self.conn = None


    def __enter__(self):
        self.open()
        return self


    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


    def open(self):
        if (self.conn is None) or (self.conn.is_connected() == False):
            config = {
                'user': 'root',
                'password': 'root',
                'host': 'localhost',
                'port': '8889',
                'database': 'data_vis_project',
                'raise_on_warnings': True,
            }
            self.conn = mysql.connector.connect(**config)


    def close(self):
        if self.conn:
            if self.conn.is_connected():
                self.conn.close()
        self.conn = None


    def get_all(self):
        return self.get_by_condition()


    def get_by_condition(self, name = None, gender = None, from_year = None, to_year = None):
        where = ""
        if (name != None) or (gender != None) or (from_year != None) or (to_year != None):
            where = "where"

            if name != None and str(name).isalpha():
                where += r" (vorname = '" + name + "')"

            if gender != None and str(gender).isalpha() and len(gender) and (gender == 'w' or gender == 'm'):
                if (where.endswith(")")):
                    where += " and"
                where += r" (geschlecht = '" + gender + "')"

            if from_year !=  None and isinstance(from_year, int):
                if(where.endswith(")")):
                    where += " and"
                where += r" (jahrgang >= " + str(from_year) + r")"

            if to_year != None and isinstance(to_year, int):
                if(where.endswith(")")):
                    where += " and"
                where += r" (jahrgang <= " + str(to_year) + r")"

        query = "SELECT * FROM vornahmen_zuerich " + where + " ORDER BY jahrgang"
        print query
        return self.execute_query(query)


    def get_names_and_gender(self):
        query = "SELECT DISTINCT vorname, geschlecht FROM vornahmen_zuerich"
        return self.execute_query(query)


    def get_summary_by_total_desc(self, limit = 100):
        query = """SELECT vorname,
                          SUM(anzahl) as total,
                          AVG(anzahl) as avg_anzahl,
                          MIN(anzahl) as min_anzahl,
                          MAX(anzahl) as max_anzahl,
                          MIN(jahrgang) as first_year,
                          MAX(jahrgang) as last_year,
                          geschlecht
                    FROM vornahmen_zuerich
                    GROUP BY vorname, geschlecht
                    ORDER BY total DESC
                    LIMIT """ + str(limit)
        return self.execute_query(query)


    def get_summary_by_total_desc_by_condition(self, from_year = 1900, to_year = 2016, gender = '%', limit = 100):
        query = """SELECT vorname,
                          SUM(anzahl) as total,
                          AVG(anzahl) as avg_anzahl,
                          MIN(anzahl) as min_anzahl,
                          MAX(anzahl) as max_anzahl,
                          MIN(jahrgang) as first_year,
                          MAX(jahrgang) as last_year,
                          geschlecht
                    FROM vornahmen_zuerich """ + \
                    "WHERE " + str(from_year) + " <= jahrgang AND jahrgang <= " + str(to_year) + " AND geschlecht like '" + gender + "' " + \
                    """GROUP BY vorname, geschlecht
                    ORDER BY total DESC
                    LIMIT """ + str(limit)
        return self.execute_query(query)


    def execute_query(self, query):
        self.open()
        cursor = self.conn.cursor()
        try:
            cursor.execute(query)
            column_names = cursor.description
            for row in cursor:
                record = {column_names[index][0]: column for index, column in enumerate(row)}
                yield record
        finally:
            if(cursor != None):
                cursor.close()


    def dump_json_async(self, result_generator):
        """
        dump json data as array async from a generator
        :param result_generator:
        :return JSON dictionary:
        """
        first = True
        yield ("[")
        for x in result_generator:
            if first:
                first = False
                yield json.dumps(x, default=helper.decimal_default)
            else:
                yield ", " + json.dumps(x, default=helper.decimal_default)
        yield ("]")

####################################################################################################################
if __name__ == '__main__':
    with NamesUnitOfWork() as w:
        print "test get_all_names()"
        for x in w.dump_json_async(w.get_all()):
            print x

        print "test get_summary()"
        for x in w.dump_json_async(w.get_summary_by_total_desc()):
            print x

        print "test get_names_and_gender()"
        for x in w.dump_json_async(w.get_names_and_gender()):
            print x


