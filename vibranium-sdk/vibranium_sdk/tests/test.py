import unittest
from flask import Flask
from openapi_generator import OpenAPISpecGenerator

class TestOpenAPISpecGenerator(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.spec_generator = OpenAPISpecGenerator(self.app)

    def test_generate_spec(self):
        self.app.add_url_rule('/test', 'test', lambda: 'test')
        spec = self.spec_generator.generate_spec()
        self.assertIn('/test', spec['paths'])
