USE db_backend;

INSERT INTO account 
( account_firstname
, account_lastname
, account_email
, account_password) 
VALUES 
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

UPDATE account 
SET account_type = 'Admin' 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

DELETE FROM account 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

UPDATE inventory 
SET inv_description = replace(inv_description, 'the small interiors', 'a huge interior') 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

SELECT i.inv_make
,      i.inv_model
,      c.classification_name 
FROM inventory i INNER JOIN classification c
ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';


UPDATE inventory
SET  inv_image = REPLACE(inv_image, '/images', '/images/vehicles')
,    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
