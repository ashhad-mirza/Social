import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ProfilePage() {
  const authState = useSelector((state) => state.auth);

  const [userProfile, setUserProfile] = useState({});

  const [userPosts, setUserPosts] = useState([]);

  const postReducer = useSelector((state) => state.postReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return (
          post.userId?.username &&
          authState.user?.userId?.username &&
          post.userId.username === authState.user.userId.username
        );
      });
      console.log(post);
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post(
      "/upload_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });
    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const hasChanges =
    userProfile?.userId?.name !== authState.user?.userId?.name ||
    userProfile?.bio !== authState.user?.bio ||
    userProfile?.currentPost !== authState.user?.currentPost ||
    JSON.stringify(userProfile?.pastWork) !==
      JSON.stringify(authState.user?.pastWork) ||
    JSON.stringify(userProfile?.education) !==
      JSON.stringify(authState.user?.education);

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                className={styles.backDrop__overlay}
                htmlFor="profilepictureUpload"
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                hidden
                type="file"
                id="profilepictureUpload"
              />
              <img
                className={styles.backDrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>
            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-Content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      type="text"
                      className={styles.nameEdit}
                      value={userProfile?.userId?.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      value={userProfile.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  <div className={styles.recentActivity}>
                    {userPosts.map((post) => {
                      return (
                        <div key={post._id} className={styles.postCard}>
                          <div className={styles.card}>
                            <div className={styles.card_profileContainer}>
                              {post.media !== "" ? (
                                <img src={`${BASE_URL}/${post.media}`} alt="" />
                              ) : (
                                <div
                                  style={{ width: "3.4rem", height: "3.4rem" }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="workHistory">
              <h4>workhistory</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {hasChanges && (
              <div
                onClick={updateProfileData}
                className={styles.updateProfileBtn}
              >
                Update Profile
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
