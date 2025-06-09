import axios from "axios";

const capCheckApi = axios.create({
  baseURL: "https://capcheck.onrender.com/api",
});

export const fetchUsers = () => {
  return capCheckApi.get("/users").then((res) => {
    return res.data.users;
  });
};

export const fetchUserById = (userId: Number) => {
  return capCheckApi.get(`/users/${userId}`).then((res) => {
    return res.data.user;
  });
};

export const fetchMushrooms = (givenParams: Object) => {
  return capCheckApi
    .get("/mushroom", { params: { ...givenParams } })
    .then((res) => {
      return res.data.mushrooms;
    });
};

export const fetchMushroomById = (mushroomId: Number) => {
  return capCheckApi.get(`/mushroom/${mushroomId}`).then((res) => {
    return res.data.mushroom;
  });
};

export const fetchPhotos = async ({ userId }: { userId: number }) => {

  return await axios.get(`https://capcheck.onrender.com/api/userphotos`, {

  return axios.get("https://capcheck.onrender.com/api/userphotos", {

    params: { user_id: userId },
  });
};
