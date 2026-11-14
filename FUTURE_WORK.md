# WinCtrl <-> Backend security

Both the docker container and the workstation companion run on internal networks without any https/certificate 
infrastructure. But I still want to prevent command injection from compromised network devices. One possible method
is to introduce explicit signing of each request sent from the backend to the workstation. 

Perhaps using JWTs with asymmetric keys.
The JWT would be unique for each request and include a nonce and a hash of the request body.
Information-hiding and encryption is a non-goal.

