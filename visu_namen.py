from flask import Flask, redirect, Response, stream_with_context, request
from database import NamesUnitOfWork
import helper


app = Flask(__name__, static_url_path='/static')


@app.route('/', methods=['GET'])
def index():
    return redirect('static/app/index.html', code=302)


@app.route('/api/summary/bytotal')
def api_summary_by_total_desc():
    with NamesUnitOfWork() as w:
        return Response(response = w.dump_json_async(w.get_summary_by_total_desc()), mimetype='application/json')


@app.route('/api/summary/byquery')
def api_summary_by_total_by_query():
    with NamesUnitOfWork() as w:
        from_year = request.args.get('from', 1990, type = int)
        to_year = request.args.get('to', 2099, type = int)
        gender = request.args.get('gender', '%', type = str)
        limit = request.args.get('limit', 100, type = int)
        return Response(response = w.dump_json_async(w.get_summary_by_total_desc_by_condition(from_year, to_year, gender, limit)), mimetype='application/json')

@app.route('/api/people/all')
def api_get_all():
    with NamesUnitOfWork() as w:
        return Response(response = w.dump_json_async(w.get_all()), mimetype='application/json')


@app.route('/api/people/male')
def api_get_male_names():
    with NamesUnitOfWork() as w:
        return Response(response = w.dump_json_async(w.get_by_condition(gender='m')), mimetype='application/json')


@app.route('/api/people/male')
def api_get_female_names():
    with NamesUnitOfWork() as w:
        return Response(response = w.dump_json_async(w.get_by_condition(gender='w')), mimetype='application/json')


@app.route('/api/people/byname/<name>')
def api_get_by_name(name):
    with NamesUnitOfWork() as w:
        return Response(response = w.dump_json_async(w.get_by_condition(name = name)), mimetype='application/json')


@app.route('/api/people/names')
def api_get_names_and_gender():
    with NamesUnitOfWork() as w:
        return Response(response = w.dump_json_async(w.get_names_and_gender()), mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)
