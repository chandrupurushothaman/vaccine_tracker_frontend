const moment = require("moment/moment");

const formatDate = (date) => {
  if (!date) return "";
  return moment(date).format("DD/MM/YYYY");
}
const formatClass = (value) => {
  // Handle null, undefined, empty arrays
  if (!value || !Array.isArray(value) || value.length === 0) return "None";

  try {
    // Convert all values to numbers and filter out invalid entries
    const validClasses = value
      .map(val => Number(val))
      .filter(val => !isNaN(val) && val > 0);

    if (validClasses.length === 0) return "None";

    // Sort classes numerically
    const sortedClasses = validClasses.sort((a, b) => a - b);

    // Format classes into ranges
    const ranges = [];
    let rangeStart = sortedClasses[0];
    let rangeEnd = rangeStart;

    for (let i = 1; i < sortedClasses.length; i++) {
      if (sortedClasses[i] === rangeEnd + 1) {
        // Extend the current range
        rangeEnd = sortedClasses[i];
      } else {
        // End the current range and start a new one
        if (rangeStart === rangeEnd) {
          ranges.push(`${rangeStart}`);
        } else {
          ranges.push(`${rangeStart}-${rangeEnd}`);
        }
        rangeStart = sortedClasses[i];
        rangeEnd = rangeStart;
      }
    }

    // Add the last range
    if (rangeStart === rangeEnd) {
      ranges.push(`${rangeStart}`);
    } else {
      ranges.push(`${rangeStart}-${rangeEnd}`);
    }

    return ranges.join(", ");
  } catch (error) {
    return "Format Error";
  }
}
const showLoading = (isShow) => {
  const event = new CustomEvent('loadingStatus', { detail: { isLoading: isShow } });
  window.dispatchEvent(event);
}

const showAlert = (alertData = { open: false, severity: "info", message: "Alert Message Here!" }) => {
  if (!alertData?.open) return;
  if (alertData.severity === "error") {
    let errMessage = alertData.message
    alertData.message = errMessage?.message || "Message not found!"
  }
  const event = new CustomEvent('showAlert', { detail: { alertData: alertData } });
  window.dispatchEvent(event);
}
const handleVaccinationErrors = (err, fieldErrors, setFieldErrors, setApiError) => {
  console.log("handleVaccinationErrors", err);
  console.log(err);
      if (err) {

          const errorData = err?.response?.data?.message || err?.message || String(err);
          if (errorData && errorData.includes("Scheduled date must be more than fifteen days from today")) {

      setApiError(`Scheduled date must be more than fifteen days from today`);
    } else {
      setApiError(errorData.error || errorData.errors.join('\n') || "Failed to create vaccination drive. Please try again.");
    }
  } else {
    setApiError("An error occurred while creating the vaccination drive. Please try again.");
  }
}

const handleStudentErrors = (err, fieldErrors, setFieldErrors, setApiError) => {
  if (err.response && err.response.data) {
    const errorData = err.response.data;

    // Handle array of error messages
    if (Array.isArray(errorData.errors)) {
      // Format multiple errors with line breaks
      const formattedErrors = errorData.errors.join('\n');
      setApiError(formattedErrors);

      // Map errors to specific fields
      const newFieldErrors = { ...fieldErrors };

      errorData.errors.forEach(error => {
        const lowerError = error.toLowerCase();
        if (lowerError.includes('age')) {
          newFieldErrors.age = error.replace('Invalid age: ', '');
        }
        if (lowerError.includes('class')) {
          newFieldErrors.class = error.replace('Invalid class: ', '');
        }
        if (lowerError.includes('name')) {
          newFieldErrors.name = error;
        }
        if (lowerError.includes('gender')) {
          newFieldErrors.gender = error;
        }
        if (lowerError.includes('date') || lowerError.includes('birth') || lowerError.includes('dob')) {
          newFieldErrors.dob = error;
        }
      });

      setFieldErrors(newFieldErrors);
    } else if (errorData.message) {
      // Single error message
      setApiError(errorData.message);
    } else {
      // Generic error
      setApiError("Failed to create student. Please try again.");
    }
  } else {
    setApiError("An error occurred while creating the student. Please try again.");
  }
}
export {
  formatDate,
  showLoading,
  showAlert,
  formatClass,
  handleVaccinationErrors,
  handleStudentErrors
}