const lengthInput = document.getElementById("lengthInput");
const lengthValue = document.getElementById("lengthValue");
const generateButton = document.getElementById("generateButton");
const passwordOutput = document.getElementById("passwordOutput");
const copyButton = document.getElementById("copyButton");

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateButton.addEventListener("click", async () => {
  const length = lengthInput.value;
  generateButton.disabled = true;
  generateButton.textContent = "Generating…";

  try {
    const response = await fetch(`/generate?length=${encodeURIComponent(length)}`);
    const data = await response.json();
    passwordOutput.value = data.password || "";
  } catch (error) {
    passwordOutput.value = "Failed to generate password.";
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Generate Password";
  }
});

copyButton.addEventListener("click", async () => {
  const value = passwordOutput.value.trim();
  if (!value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1200);
  } catch (err) {
    copyButton.textContent = "Copy Failed";
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1200);
  }
});
