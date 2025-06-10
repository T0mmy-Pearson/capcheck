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
import { fetchComments, postComment } from "../utils/api"; // adjust path if needed
export interface Post {
  photoId: number;
  photo: string;
  userId: number;
  username: string;
  avatar_url: string;
  caption: string;
  latitude: number;
  longitude: number;
  mushroomId: number;
  likes: number;
  liked: boolean;
}
interface Comment {
  commentId: number;
  comment: string;
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
  const toggleLike = async () => {
    const userId = 1; // :closed_lock_with_key: Replace with real user ID from context
    const method = liked ? "DELETE" : "POST";
    const url = `https://capcheck.onrender.com/api/userphotos/${post.photoId}/like?user_id=${userId}`;
    try {
      await fetch(url, { method });
      setLiked((prev) => !prev);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };
  const loadComments = async () => {
    try {
      const res = await fetchComments(post.photoId);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) return;
    try {
      await postComment({
        photoId: post.photoId,
        userId: Number(userId),
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
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.avatar_url }} style={styles.avatar} />
        <Text style={styles.username}>{post.username}</Text>
      </View>
      {/* Photo */}
      <Image source={{ uri: post.photo }} style={styles.photo} />
      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleLike}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={22}
            color="red"
          />
        </TouchableOpacity>
        <FontAwesome name="comment-o" size={22} style={styles.commentIcon} />
      </View>
      {/* Caption */}
      <Text style={styles.caption}>{post.caption}</Text>
      <Text style={styles.likes}>{likesCount} likes</Text>
      {/* Comments List */}
      <View style={styles.comments}>
        {comments.map((c) => (
          <Text key={c.commentId} style={styles.commentText}>
            <Text style={styles.commentUser}>{c.username}: </Text>
            {c.comment}
          </Text>
        ))}
      </View>
      {/* Add New Comment */}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    marginVertical: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  commentIcon: {
    marginLeft: 16,
  },
  caption: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  likes: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#222",
  },
  comments: {
    marginTop: 8,
  },
  commentText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  commentUser: {
    fontWeight: "bold",
  },
  commentForm: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 6,
    marginRight: 10,
    backgroundColor: "#F9F9F9",
  },
  commentButton: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
export default CommunityPost;