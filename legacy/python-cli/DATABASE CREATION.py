import sys
import mysql.connector as sql
conn=sql.connect(host='localhost',user='root',passwd='manager')
cur=conn.cursor()
if conn.is_connected:
    cur.execute("create database dental_management_system")
    print("Database created succefully")
    
