import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { auth } from "../firebase";
import {
  signOut,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DummyPage = () => {
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [typingFinished, setTypingFinished] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || "Mysterious Player");
        setPhotoURL(user.photoURL || "");
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeUsername = () => {
    setAnchorEl(null);
    setOpenUsernameDialog(true);
  };

  const handleChangePassword = () => {
    setAnchorEl(null);
    setOpenPasswordDialog(true);
  };

  const handleUploadClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        await uploadProfilePicture(file);
      }
    };
    fileInput.click();
  };

  const uploadProfilePicture = async (file) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, { photoURL: downloadURL });

      setPhotoURL(downloadURL);
      setSuccess("Profile picture updated successfully!");
    } catch (error) {
      setError("Error updating profile picture. Please try again.");
    }
  };

  const handleSaveUsername = async () => {
    try {
      if (auth.currentUser && newUsername.trim()) {
        await updateProfile(auth.currentUser, { displayName: newUsername });
        setUsername(newUsername);
        setSuccess("Username updated successfully!");
      }
      setOpenUsernameDialog(false);
    } catch (error) {
      setError("Error updating username.");
    }
  };

  const handleSavePassword = async () => {
    try {
      if (auth.currentUser && newPassword.trim().length >= 6) {
        await updatePassword(auth.currentUser, newPassword);
        setSuccess("Password updated successfully!");
      } else {
        setError("Password must be at least 6 characters long.");
      }
      setOpenPasswordDialog(false);
    } catch (error) {
      setError("Error updating password. Please try again.");
    }
  };

  const text = `Hiii, ${username || "Mysterious Player"}! 🌚 Congrats! You’ve successfully signed up for Squid Game! 🦑🏆`;
  const message = `
    …Just kidding! 😂 (Or are we? 👀)
    
    Welcome to this completely pointless page! 🙃 But hey, at least you made it this far.
    
    Also, just a little reminder:
    ✨ You’re doing great, even if it doesn’t feel like it.
    ✨ If today’s been rough, you’ll pull through—I believe in you!
    ✨ And let’s be honest, you’re looking amazing today. (No, seriously.)

    Now make sure you have a nice day ❤️
  `;

  return (
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: 4,
        textAlign: "center",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Avatar
          src={photoURL}
          alt={username}
          sx={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={handleAvatarClick}
        >
          {!photoURL && (username ? username.charAt(0).toUpperCase() : "M")}
        </Avatar>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleUploadClick}>Change Profile Picture</MenuItem>
          <MenuItem onClick={handleChangeUsername}>Change Username</MenuItem>
          <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Typography variant="h4" component="div" sx= {{color: "white", paddingLeft: {sm:2, md: 15}, paddingRight: {sm:2, md: 4}, paddingTop: {sm: 6, xs: 5}, fontSize: {xs: "24px", sm: "30px"}}} >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onAnimationComplete={() => index === text.length - 1 && setTypingFinished(true)}
          >
            {char}
          </motion.span>
        ))}
      </Typography>

      {typingFinished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", marginTop: 3, color: "white", paddingLeft: {md: 5, sm: 2, lg: 3}, paddingRight: {md: 5, sm: 2, lg: 3}, fontSize: {}, }}>
            {message}
          </Typography>
        </motion.div>
      )}
</Box>
   

    <Dialog open={openUsernameDialog} onClose={() => setOpenUsernameDialog(false)}>
      <DialogTitle>Change Username</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Username"
          fullWidth
          variant="outlined"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenUsernameDialog(false)}>Cancel</Button>
        <Button onClick={handleSaveUsername} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
        <Button onClick={handleSavePassword} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default DummyPage;
