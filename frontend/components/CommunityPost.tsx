import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export interface Post {
  id: number;
  user: {
    username: string;
    avatarUrl: string;
  };
  photoUrl: string;
  caption: string;
  likes: number;
  liked: boolean;
  timestamp: string;
  comments: {
    id: number;
    text: string;
  }[];
}

interface Props {
  post: Post;
}

const CommunityPost: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    // TODO: Optionally call your backend here
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatarUrl }} style={styles.avatar} />
        <Text style={styles.username}>{post.user.username}</Text>
        <Text style={styles.timestamp}> · {post.timestamp}</Text>
      </View>

      {/* Photo */}
      <Image source={{ uri: post.photoUrl }} style={styles.photo} />

      {/* Actions */}
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

      {/* Caption */}
      <Text style={styles.caption}>{post.caption}</Text>

      {/* Like count */}
      <Text style={styles.likes}>{likesCount} likes</Text>

      {/* View Comments */}
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
