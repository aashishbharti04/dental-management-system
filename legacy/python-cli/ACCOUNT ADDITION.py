import sys
import mysql.connector as sql
conn=sql.connect(host='localhost',user='root',passwd='manager',database='dental_management_system')
cur=conn.cursor()
if conn.is_connected:
    user=input("Enter New User Name : ")
    user=user.upper()
    passwrd=input("Enter New Password : ")
    passwrd=passwrd.upper()
    cur.execute("insert into accounts values('" + user + "','" + passwrd + "')")
    print("ACCOUNT ADDED SUCCEFULLY")
    conn.commit()
