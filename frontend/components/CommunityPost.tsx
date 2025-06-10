import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchComments, postComment, toggleLike } from "../utils/api";

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

interface Comment {
  commentId: number;
  text: string;
  username: string;
}

interface Props {
  post: Post;
}

const CommunityPost: React.FC<Props> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleToggleLike = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;
    await toggleLike({ userId: Number(userId), photoId: post.id, liked });
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const loadComments = async () => {
    try {
      const res = await fetchComments(post.id);
      setComments(
        res.data.usercomments.map((c: any) => ({
          commentId: c.commentId,
          text: c.body,
          username: `User${c.userId}`,
        }))
      );
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;
    try {
      await postComment({
        userId: Number(userId),
        photoId: post.id,
        comment: newComment.trim(),
      });
      setNewComment("");
      loadComments();
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: post.user.avatarUrl }} style={styles.avatar} />
        <Text style={styles.username}>{post.user.username}</Text>
        <Text style={styles.timestamp}> · {post.timestamp}</Text>
      </View>
      <Image source={{ uri: post.photoUrl }} style={styles.photo} />
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleToggleLike}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={22}
            color="red"
          />
        </TouchableOpacity>
        <FontAwesome name="comment-o" size={22} style={styles.commentIcon} />
      </View>
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.likes}>{likesCount} likes</Text>
      {comments.map((c) => (
        <Text key={c.commentId} style={styles.commentLine}>
          <Text style={styles.commentUser}>{c.username}: </Text>
          {c.text}
        </Text>
      ))}
      <View style={styles.commentForm}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          style={styles.commentInput}
        />
        <TouchableOpacity onPress={handleCommentSubmit}>
          <Text style={styles.commentButton}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginVertical: 10,
    padding: 12,
    borderRadius: 12,
  },
  header: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  username: { fontWeight: "bold", fontSize: 15, color: "#333" },
  timestamp: { fontSize: 12, color: "#888", marginLeft: 6 },
  photo: { width: "100%", height: 240, borderRadius: 10, marginVertical: 8 },
  actions: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  commentIcon: { marginLeft: 16 },
  caption: { fontSize: 14, color: "#444" },
  likes: { fontWeight: "bold", fontSize: 14, color: "#222" },
  commentLine: { fontSize: 13, color: "#333", marginTop: 4 },
  commentUser: { fontWeight: "bold" },
  commentForm: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  commentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
    backgroundColor: "#F2F2F2",
    marginRight: 8,
  },
  commentButton: { color: "#007AFF", fontWeight: "bold" },
});

export default CommunityPost;
