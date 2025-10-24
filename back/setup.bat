@echo off
echo Setting up Django backend...
echo.

echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Populating sample data...
python manage.py populate_data

echo.
echo Setup complete!
echo.
echo To create a superuser, run: python manage.py createsuperuser
echo To start the server, run: python manage.py runserver
echo.
pause
