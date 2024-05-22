import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Paper,
  TextField,
  ImageList,
  ImageListItem,
  Typography,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const SearchPage = () => {
  const [imageData, setImageData] = useState<[]>([]);
  const [search, setSearch] = useState<String>("");
  const [page, setPage] = useState<Number>(1);
  const [noData, setNoData] = useState<String>("No Data Available");

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const submitHandler = async () => {
    // e?.preventDefault()
    handleOpen();
    try {
      const res = await axios.get(
        `/search?query=${search}&per_page=10&page=${page}`
      );
      setImageData(res?.data?.photos);
      handleClose();
    } catch (err) {
      setImageData([]);
      handleClose();
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (search) {
        submitHandler();
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search, page]);

  return (
    <Stack direction="column" spacing={2} p={2}>
      <Paper
        elevation={4}
        sx={{ borderRadius: "5px", width: "100%", height: "70px" }}
      >
        <Box
          sx={{ display: "flex", alignItems: "flex-end", width: { lg: "70%" } }}
          p={1}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              paddingLeft: { md: 4, xs: 2 },
              paddingRight: { md: 4, xs: 2 },
            }}
          >
            Image Search
          </Typography>
          <TextField
            id="input-with-sx"
            label="Search"
            variant="standard"
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { lg: "70%" } }}
          />
          <SearchIcon sx={{ color: "action.active", ml: 2, my: 0.5 }} />
        </Box>
      </Paper>
      <Paper
        elevation={4}
        sx={{
          borderRadius: "5px",
          width: "100%",
          height: "550px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {imageData?.length === 0 ? (
          <Box>
            <Typography
              variant="h3"
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {noData}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                borderRadius: "5px",
                width: { xs: 450, md: 800 },
                height: 450,
                overflowY: "scroll",
              }}
            >
              <ImageList variant="masonry" cols={3} gap={8}>
                {imageData?.map((item: any) => (
                  <ImageListItem key={item?.src?.original}>
                    <img
                      srcSet={`${item?.src?.original}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item?.src?.original}?w=248&fit=crop&auto=format`}
                      alt={item.alt}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
            <Stack p={2}>
              <Pagination
                count={10}
                color="primary"
                onClick={(e: any) => {
                  setPage(parseInt(e?.target?.innerText) + 1);
                }}
              />
            </Stack>
          </>
        )}
      </Paper>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
  );
};

export default SearchPage;
