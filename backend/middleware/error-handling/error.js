//handle field formatting, empty fields, and mismatched passwords 
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map(el => el.message);
  let fields = Object.values(err.errors).map(el => el.path);
  let code = 400;

  if(errors.length > 1) {
    const formattedErrors = errors.join(' ');
    res.status(code).send({message: formattedErrors, fields: fields});
  } else {
    res.status(code).send({message: errors, fields: fields})
  }
}

//handle email or usename duplicates
const handleDuplicateKeyError = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 409;
  // const error = `An account with the ${field} - ${err.keyValue[field[0]]} already exists.`;
  const error = `An account with the ${field} already exists.`;
  res.status(code).send({message: error, fields: field });
}

const handleCustomError = (err, res) => {
  const code = 404;
  const error = err.message;
  res.status(code).send({message: error});
}

//error controller function
module.exports = (err, req, res, next) => {
  try {
    console.log('congrats you hit the error middleware');
    console.error(err);
    if(err.name === 'ValidationError') return err = handleValidationError(err, res); 
    if(err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
    if(err.name === 'Error') return err = handleCustomError(err, res);
  } catch(err) {
    res.status(500).send('An unknown error occured.');
  }
}