from setuptools import setup, find_packages

setup(
    name='vibranium-sdk',
    version='0.1.1',
    description='SDK for fetching and testing OpenAPI specs from FastAPI applications',
    author='Om Avhad',
    author_email='omavhad22@gmail.com',
    long_description=open('README.md').read(),  # Long description read from README.md
    long_description_content_type='text/markdown',  # Format of the long description
    packages=find_packages(),
    install_requires=[
        'requests',
        'openapi3',
        'faker'
    ],
    entry_points={
        'console_scripts': [
            'vibranium-sdk = vibranium_sdk.__main__:main',
        ],
    },
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
    ],
)