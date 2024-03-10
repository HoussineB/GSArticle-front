import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { Button, Chip, LinearProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function Article() {
  //endpointApi
  const endPointApi = "http://localhost:4000/api/articles";
  //initialiserArticle

  const initialArticle = {
    label: "",
    serial: "",
    priceAchat: 0,
    priceVente: 0,
    datecreate: "",
  };

  //state du liste articles global
  const [listArticles, setListArticles] = useState([]);
  const [dataArticle, setDataArticle] = useState(initialArticle);
  const [error, setError] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [open, setOpen] = useState(false);
  const [idArticleModif, setIdArticleModif] = useState(null);
  const [articleSelectedDelete, setArticleSelectedDelete] = useState({});

  //////ADD Article
  const handleAddArticle = () => {
    const requestData = {
      label: dataArticle.label,
      serial: dataArticle.serial,
      priceAchat: dataArticle.priceAchat,
      priceVente: dataArticle.priceVente,
    };

    axios
      .post(endPointApi, requestData)
      .then((response) => {
        setListArticles((prevArticles) => [...prevArticles, response.data]);
        setDataArticle(initialArticle);
      })
      .catch((error) => {
        console.error("Error while saving user:", error);
        setError(error.message);
      });
  };

  ///////////////////////////////Edit Article (preparation update)////////////////
  const handleEditArticle = (articleModif) => {
    setDataArticle(articleModif);
    setIdArticleModif(articleModif._id);
  };
  //////UPDATE Article
  const handleUpdateArticle = (articleId) => {
    const requestData = {
      label: dataArticle.label,
      serial: dataArticle.serial,
      priceAchat: dataArticle.priceAchat,
      priceVente: dataArticle.priceVente,
    };
    // const apiEndpoint = `http://localhost:4000/api/articles/${articleId}`;
    axios
      .put(endPointApi + `/${articleId}`, requestData)
      .then(() => {
        setListArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.id === articleId ? { ...article, ...requestData } : article
          )
        );
        setIdArticleModif(null);
        setDataArticle(initialArticle);
      })
      .catch((error) => {
        console.error("Error while updating user:", error);
        setError(error.message);
      });
  };
  //dialog delete
  const handleClickOpen = (articleSelected) => {
    setArticleSelectedDelete(articleSelected);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //////DELETE Article
  const handleDeleteArticle = (articleId) => {
    // const apiEndpoint = `http://localhost:4000/api/articles/${articleId}`;
    axios
      .delete(endPointApi + `/${articleId}`)
      .then((res) => {
        setListArticles(
          listArticles.filter((article) => article._id !== articleId)
        );
        handleClose();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const displayListArticles = () => {
    axios
      .get(endPointApi)
      .then((res) => {
        setListArticles(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoadingProgress(false);
      });
  };

  useEffect(() => {
    displayListArticles();
  }, [dataArticle]);

  return (
    <>
      <center>
        <h1>List des Articles</h1>
      </center>
      <h2>Ajouter/Modifier Article</h2>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            label="Label Article"
            value={dataArticle.label}
            onChange={(e) =>
              setDataArticle({ ...dataArticle, label: e.target.value })
            }
          />
          <TextField
            label="Serial"
            value={dataArticle.serial}
            onChange={(e) =>
              setDataArticle({ ...dataArticle, serial: e.target.value })
            }
          />
          <br></br>
          <TextField
            label="Price Achat"
            value={dataArticle.priceAchat}
            type="number"
            onChange={(e) =>
              setDataArticle({ ...dataArticle, priceAchat: e.target.value })
            }
          />
          <TextField
            label="Price Vente"
            value={dataArticle.priceVente}
            type="number"
            onChange={(e) =>
              setDataArticle({ ...dataArticle, priceVente: e.target.value })
            }
          />
        </div>
        {idArticleModif != null ? (
          <Button onClick={() => handleUpdateArticle(idArticleModif)}>
            <Chip
              label=" Modifier Article"
              color="success"
              variant="outlined"
            />
          </Button>
        ) : (
          <Button onClick={handleAddArticle}>
            <Chip label=" Ajouter Article" color="primary" variant="outlined" />
          </Button>
        )}
      </Box>
      <hr></hr>
      {loadingProgress && <LinearProgress color="success" />}
      {error && <h4 style={{ color: "red" }}>{error}</h4>}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Label Article</TableCell>
              <TableCell align="right">Serial</TableCell>
              <TableCell align="right">Price Achat</TableCell>
              <TableCell align="right">Price Vente</TableCell>
              <TableCell align="right">Date creation</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listArticles.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.label}
                </TableCell>
                <TableCell align="right">{row.serial}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={row.priceAchat}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={row.priceVente}
                    color="success"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">{row.datecreate}</TableCell>

                <TableCell align="right">
                  <Button
                    color="primary"
                    onClick={() => handleEditArticle(row)}
                  >
                    <EditIcon />
                  </Button>

                  <Button color="error" onClick={() => handleClickOpen(row)}>
                    <DeleteIcon />
                  </Button>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Delete Article?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Voulez vous vraiment supprimer l'article{" "}
                        {articleSelectedDelete.label}.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button color="success" onClick={handleClose}>
                        <CancelIcon />
                      </Button>
                      <Button
                        color="error"
                        onClick={() =>
                          handleDeleteArticle(articleSelectedDelete._id)
                        }
                      >
                        <DeleteForeverIcon />
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Article;
