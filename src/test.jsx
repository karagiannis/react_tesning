// Ingen filepath: du kan lägga detta i t.ex. src/App.jsx
import React, { useState } from "react";
import { Container, Box, Typography, Button, Stepper, Step, StepLabel, Paper } from "@mui/material";

const steps = [
  "Logga in / Registrera",
  "Företagsinformation",
  "Bankkonto & KYC",
  "Sammanfattning"
];

export default function OnboardingApp() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Container maxWidth="sm">
      {/* Hero Section */}
       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined">Logga in</Button>
            <Button variant="contained">Registrera</Button>
        </Box>

      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Välkommen till Onboarding
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Enkel och säker onboarding för redovisningsbyråer
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {/* Här kan du rendera olika komponenter beroende på steg */}
          <Typography>
            {`Steg ${activeStep + 1}: ${steps[activeStep]}`}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
          >
            Nästa
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}