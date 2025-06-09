import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export interface Post {
  id: number;
  photoUrl: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  caption: string;
  latitude: string;
  longitude: string;
  mushroomId: number;
  likes: number;
  liked: boolean;
  timestamp: string;
  comments: { id: number; text: string }[];
}

interface Props {
  post: Post;
}

const CommunityPost: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    const userId = 1; // 🔐 Replace with logged-in user ID later
    const method = liked ? "DELETE" : "POST";
    const url = `https://capcheck.onrender.com/api/userphotos/${post.id}/like?user_id=${userId}`;

    fetch(url, { method })
      .then(() => {
        setLiked((prev) => !prev);
        setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
      })
      .catch((err) => console.error("Error toggling like:", err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatarUrl }} style={styles.avatar} />
        <Text style={styles.username}>{post.user.username}</Text>
        <Text style={styles.timestamp}> · {post.timestamp}</Text>
      </View>

      <Image source={{ uri: post.photoUrl }} style={styles.photo} />

      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleLike}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={22}
            color="red"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Open comments")}>
          <FontAwesome name="comment-o" size={22} style={styles.commentIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.likes}>{likesCount} likes</Text>

      <TouchableOpacity>
        <Text style={styles.viewComments}>
          View all {post.comments.length} comments
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  username: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  photo: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginVertical: 6,
  },
  actions: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 16,
  },
  commentIcon: {
    marginLeft: 16,
  },
  caption: {
    marginBottom: 2,
    fontSize: 14,
  },
  likes: {
    fontWeight: "bold",
    fontSize: 14,
  },
  viewComments: {
    color: "gray",
    fontSize: 13,
  },
});

export default CommunityPost;
