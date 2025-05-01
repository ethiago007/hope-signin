import React, { useState, useEffect } from "react";
import {
    Grid2,
    Card,
    CardMedia,
    CardActionArea,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    CircularProgress,
    Box,
  } from '@mui/material';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

export default function UnsplashGallery() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.unsplash.com/photos?client_id=${ACCESS_KEY}&per_page=20`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching photos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid2 container spacing={2} padding={2}>
        {photos.map((photo) => (
          <Grid2 item xs={6} sm={4} md={3} key={photo.id}>
            <Card>
              <CardActionArea onClick={() => setSelectedPhoto(photo)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={photo.urls.small}
                  alt={photo.alt_description || 'Unsplash Image'}
                />
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogTitle>{selectedPhoto.alt_description || 'Untitled Photo'}</DialogTitle>
            <DialogContent>
              <img
                src={selectedPhoto.urls.regular}
                alt={selectedPhoto.alt_description}
                width="100%"
                style={{ borderRadius: '8px' }}
              />
              <Typography variant="body2" marginTop={2}>
                Photo by {selectedPhoto.user.name}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
}
