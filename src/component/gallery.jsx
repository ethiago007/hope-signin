import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Alert,
  Button,
} from "@mui/material";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { trio } from "ldrs";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import LandscapeIcon from "@mui/icons-material/Landscape";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import AnimationIcon from "@mui/icons-material/Animation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const categories = [
  { icon: <HomeIcon />, label: "Home" },
  { icon: <CodeIcon />, label: "Technology" },
  { icon: <DirectionsCarFilledIcon />, label: "Cars" },
  { icon: <LandscapeIcon />, label: "Landscape" },
  { icon: <BedtimeIcon />, label: "Moon and Stars" },
  { icon: <AnimationIcon />, label: "Anime" },
];

const settings = [{ icon: <ArrowBackIcon />, label: "Back" }];

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState("house");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("Home");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openUsernameDialog, setOpenUsernameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const fetchImages = async (query) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=30&client_id=${ACCESS_KEY}`
      );
      setImages(res.data.results);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(searchTerm);
  }, []);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleCategoryClick = (label) => {
    setSearchTerm(label);
    setActive(label);
    fetchImages(label);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUsername(
          userDoc.exists()
            ? userDoc.data().username
            : user.displayName || "Mysterious Player"
        );
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

  const handleSettingClick = (label) => {
    if (label === "Back") {
      navigate("/dummy");
    } else {
      setActive(label);
    }
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

  const handleSaveUsername = async () => {
    try {
      if (auth.currentUser && newUsername.trim()) {
        await updateProfile(auth.currentUser, { displayName: newUsername });

        if (userId) {
          await updateDoc(doc(db, "users", userId), { username: newUsername });
        }

        setUsername(newUsername); // Update state without refresh
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


  trio.register();


  return (
    <>
      <Box display="flex" sx={{ height: "100vh", margin: 0, padding: 0 }}>
        {" "}
        <Collapse in={open} orientation="horizontal">
          {" "}
          <Box
            sx={{
              width: open ? 250 : 70,
              bgcolor: "#3d2c8d",
              color: "white",
              borderRight: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 2,
              transition: "width 0.3s ease",
            }}
          >
            {" "}
            <Box>
              {" "}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                {" "}
                <Typography variant="h6" fontWeight="bold" color="white">
                  {" "}
                  {open && "Gallery"}{" "}
                </Typography>{" "}
                <IconButton
                  onClick={() => setOpen(false)}
                  sx={{ color: "white" }}
                >
                  {" "}
                  <ChevronLeftIcon />{" "}
                </IconButton>{" "}
              </Box>
              <TextField
                variant="outlined"
                placeholder="Search"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) =>  setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
              if (e.key === "Enter"){ fetchImages(searchTerm);
                setActive(null);
              }}}
                sx={{
                  mb: 2,
                  input: { color: "white" },
                  label: { color: "white" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>{ 
                          fetchImages(searchTerm);
                          setActive(null);
                        }}
                        sx={{ color: "white" }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <List>
                {categories.map((item) => (
                  <ListItem
                    button
                    key={item.label}
                    onClick={() => handleCategoryClick(item.label)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor:
                        active === item.label
                          ? "rgba(255,255,255,0.2)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                      color: "white",
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.label} />}
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2, borderColor: "white" }} />
              <List>
                {settings.map((item) => (
                  <ListItem
                    button
                    key={item.label}
                    onClick={() => handleSettingClick(item.label)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      cursor: "pointer",
                      backgroundColor:
                        active === item.label
                          ? "rgba(255,255,255,0.2)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                      },
                      color: "white",
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.label} />}
                  </ListItem>
                ))}
              </List>
            </Box>
            {open && (
              <Box sx={{ mt: 3, p: 1, borderRadius: 2 }}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    alt={username}
                    sx={{ width: 50, height: 50, cursor: "pointer", mr: 1 }}
                    onClick={handleAvatarClick}
                  >
                    {username ? username.charAt(0).toUpperCase() : "M"}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleChangeUsername}>
                      Change Username
                    </MenuItem>
                    <MenuItem onClick={handleChangePassword}>
                      Change Password
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="white"
                    >
                      {username || "Mysterious Player"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Collapse>
        {!open && (
          <Box
            sx={{
              width: 70,
              bgcolor: "#3d2c8d",
              borderRight: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1,
            }}
          >
            <IconButton onClick={() => setOpen(true)} sx={{ color: "white" }}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            bgcolor: "#fff",
          }}
        >
          {loading ? (
             <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                  }}
                >
                  <l-trio size="70" speed="1.3" color="#3d2c8d"></l-trio>
                </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 2,
              }}
            >
              {images.map((img) => (
                <Box
                  key={img.id}
                  sx={{
                    position: "relative",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: 1,
                  }}
                >
                  <img
                    src={img.urls.small}
                    alt={img.alt_description}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={openUsernameDialog}
        onClose={() => setOpenUsernameDialog(false)}
      >
        <DialogTitle>Change Username</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUsernameDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveUsername} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePassword} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GalleryPage;
