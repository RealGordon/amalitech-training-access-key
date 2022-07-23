
##  Title: Access Key Manager
### Project Objective
Micro-Focus Inc., a software company has built a school management platform that is multitenant i.e., various schools can set up on the platform as though the platform was built specifically for them. They have agreed to use an access key-based approach to monetize it rather than building payment features into the school software. They have decided to outsource the project to you, to build a key manager, a web application that schools can use to purchase access keys to activate their school account.
### Customer Requirements
School IT Personnel
1. Should be able to signup & log in with an email and password 
    + click `verify email` for email account verification. 
    + Click `Trouble sigining in` to  reset password and to recover lost passwords.
![plot]()
2. Should be able to see a list of all access keys granted: active, expired or revoked.
3. For each access key, the personnel should be able to see the status, date of procurement and expiry date.
4. A user should not be able to get a new key if there is an active key already assigned to him/her. Only one key can be active at a time.

### Focus Admin
1. Should be able to log in with an email and password.
2. Should be able to manually revoke a key
3. Should be able to see all keys generated on the platform and see the status, date of
4. procurement and expiry date.
5. Should be able to access an endpoint, such that if the school email is provided, the endpoint should return status code 200 and details of the active key if any is found, else it should return 404. This is to enable them to integrate their school software with your key manager
Deliverables

### ER diagram of database design

### [Deployed link](https://amalitech-node-project.el.r.appspot.com/static/amalitech/projects/keyManager/user/index.html)