# WinCtrl <-> Backend security

Both the docker container and the workstation companion run on internal networks without any https/certificate 
infrastructure. But I still want to prevent command injection from compromised network devices. One possible method
is to introduce explicit signing of each request sent from the backend to the workstation. 

Perhaps using JWTs with asymmetric keys.
The JWT would be unique for each request and include a nonce and a hash of the request body.
Information-hiding and encryption is a non-goal.


# Calendar integration tests

Google Calendar sync is disabled (`AggregateCalendarState.refresh`) until sign-in moves from the tray icon to the
frontend, so `CalendarIT` only covers the empty endpoint. Once sync is back, the Google API root URL could be made
configurable (`Calendar.Builder.setRootUrl`) and pointed at a WireMock server, with a stored test credential in
`DATA_DIR/data/google/...`.
