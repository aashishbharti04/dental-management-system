import mysql.connector as sql
conn=sql.connect(host='localhost',user='root',passwd='manager',database='dental_management_system')
cur=conn.cursor()
cur.execute('create table patient_record(Patient_Name varchar(50),Age int(3),Doctor_Conculted varchar(50),Address varchar(150),Phone_Number bigint(15))')
cur.execute('create table salary_record(Employee_Name varchar(50),Proffession varchar(20),Salary_Amount varchar(9),Address varchar(150),Phone_Number bigint(15))')
cur.execute('create table accounts(User_Name varchar(20) primary key,password varchar(30) unique)')
print('Tables created successfully')
conn.commit()

