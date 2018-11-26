import checkRequestErrors from "./errors";

function patchData(url = ``, data = {}, email="", password ="") {
  // Default options are marked with *
  return fetch(url, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      email: email,
      password: password
    },
    body: JSON.stringify(data)
  }).then(checkRequestErrors);
}

export default patchData;