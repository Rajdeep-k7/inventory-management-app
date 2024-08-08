"use client";

import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Container,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

// Styles for the modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "#333",
  color: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]); // State to hold inventory items
  const [open, setOpen] = useState(false); // State to handle modal open/close
  const [itemName, setItemName] = useState(""); // State to hold the name of the item to be added
  const [itemQuantity, setItemQuantity] = useState(1); // State to hold the quantity of the item to be added

  // Function to update the inventory from the Firestore database
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  // Function to increment the quantity of an item
  const incrementItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  // Function to decrement the quantity of an item
  const decrementItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Function to delete an item from the inventory
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  // Function to add a new item with a specified quantity
  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: existingQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity: quantity });
    }
    await updateInventory();
  };

  // Update the inventory when the component mounts
  useEffect(() => {
    updateInventory();
  }, []);

  // Handlers to open and close the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container
      style={{
        backgroundImage: "url(/images/blackveg.jpg)",
        backgroundSize: "cover",
        height: "100vh",
        width: "300vh",
        backgroundPosition: "bottom",
      }}
    >
      <Box p={4} textAlign="center">
        <Typography
          variant="h4"
          gutterBottom
          style={{ color: "white", fontWeight: "bold" }}
        >
          Welcome to your Pantry !!
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ backgroundColor: "#808080", color: "white" }}
        >
          Add Item
        </Button>

        <Stack spacing={2} mt={5}>
          {inventory.map((item) => (
            <Box
              key={item.name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#C0C0C0"
              p={2}
              borderRadius={5}
              sx={{ maxWidth: "75%" }}
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h6" ml={3}>
                  {item.name}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  onClick={() => decrementItem(item.name)}
                >
                  -
                </Button>
                <Typography variant="h6" mx={2}>
                  {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => incrementItem(item.name)}
                >
                  +
                </Button>
                <Box sx={{ marginLeft: 2 }}>
                  {" "}
                  {/* Add spacing between buttons */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteItem(item.name)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ ...style, backgroundColor: "#fff", color: "#000" }}>
            {" "}
            {/* Apply styles to Box */}
            <Typography variant="h5">Add Item</Typography>
            <TextField
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                "& .MuiInputBase-root": { backgroundColor: "#fff" }, // Target TextField root element
                "& .MuiInputBase-input": { color: "#000" }, // Target TextField input field
                "& .MuiInputLabel-root": { color: "#000" }, // Target the label
              }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              sx={{
                "& .MuiInputBase-root": { backgroundColor: "#fff" }, // Target TextField root element
                "& .MuiInputBase-input": { color: "#000" }, // Target TextField input field
                "& .MuiInputLabel-root": { color: "#000" }, // Target the label
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName, itemQuantity);
                handleClose();
              }}
              sx={{ backgroundColor: "#007bff", color: "#fff" }} // Keep button styles
            >
              Add
            </Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
}
