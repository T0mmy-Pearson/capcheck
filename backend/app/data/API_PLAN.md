get / --> message saying API root
get /api(returns api roots)
get api/mushroom --> getting all of the mushrooms
get api/mushroom --> getting an edible mushroom
get api/mushroom?month=currentmonth --> getting mushroom by month
get api/mushroom/mushroom_Id --> getting individual mushrooms by id
get api/users --> getting all of the users
get api/users/user_Id --> locate user profile
get api/Users/user_id/user_photos --> getting photos of users
get api/UserPhotos/UserPhotoId/comments
get api/userphotos/{photoId}/likes
get api/mushroom/mushroom_id/location --> getting a location of a specific mushroom
get api/userphotos

post api/UserPhotos --> post a photo
post api/UserPhotos/UserPhotoId/comments
post api/userphotos/{photoId}/like

patch api/users/user_id --> updating scrore, username and avatar

delete api/UserPhotos --> delete a photo
delete api/UserPhotos/UserPhotoId/comments
delete api/userphotos/{photoId}/like
