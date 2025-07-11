
// For Vite projects, use import.meta.env; for Create React App, ensure process.env is available.
// Example for Vite:
const baseUrl = import.meta.env.VITE_API_URL // fallback to empty string if not set

// If using Create React App, you can use:
// const baseUrl = process.env.REACT_APP_API_URL || '';

export const fetchSinToken = async ( endpoint, data, method = 'GET' ) => {

  console.log('inicio fetchSinToken');
 try {
  
   const url = `${ baseUrl }/${ endpoint }`;
   console.log('url', url);

  if ( method === 'GET' ) {
    console.log("1")
    
    const respuesta = await fetch( url );
    return await respuesta.json();

  } else {
    console.log("2")
    const respuesta = await fetch( url, {
      method,
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify( data )

    } );
    console.log(respuesta)
    return await respuesta.json();
  }

 } catch (error) {
  console.error('Error in fetchSinToken:', error);
  throw error;
  
 }
  

};

export const fetchConToken = async ( endpoint, data, method = 'GET' ) => {

 try {
  
   const url = `${ baseUrl }/${ endpoint }`;
   const token = localStorage.getItem('token') || '';

  if ( method === 'GET' ) {    
    const respuesta = await fetch( url, {
      headers: {
        'x-token': token
      }
    } );
    return await respuesta.json();

  } else {
    const respuesta = await fetch( url, {
      method,
      headers: {
        'Content-type': 'application/json',
        'x-token': token
      },
      body: JSON.stringify( data )

    } );
    return await respuesta.json();
  }

 } catch (error) {
  console.log('Error in fetchConToken:', error);
  throw new Error('Error in fetchConToken: ' + error.message);
  
 }
  

};

