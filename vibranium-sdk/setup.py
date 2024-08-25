from setuptools import setup, find_packages

setup(
    name='vibranium-sdk',
    version='0.1.0',
    description='SDK for fetching and testing OpenAPI specs from FastAPI applications',
    author='Om Avhad',
    author_email='omavhad22@gmail.com',
    packages=find_packages(),
    install_requires=[
        'requests',
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