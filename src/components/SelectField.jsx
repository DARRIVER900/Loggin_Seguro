// Creamos una funcion que reciba la prop id desde Loggin para que se identifique para que, 
// al enviar el formulario, el sistema pueda encontrar el valor seleccionado usando e.target.role.value.

function SelectField({ id }) {

  const options = [
  // Es lo que realmente se guarda en Firestore (l "admin" o "user" en la consola).
    { value: "user", label: "Usuario Normal"},
    { value: "admin", label: "Administrador"}
  ]

  return (
    <div className="input-wrapper">

      {/* El menu desplegable es obligatorio y  usa id y name para que el login sepa de donde sacar el dato */}
      <select 
      id={id} 
      name={id} 
      className="input-field"
      required>
      // La opcion por defecto tendra el texto que aparecera en el cuadro
      // disabled: Evita que el usuario pueda volver a elegir este texto una vez que abrió la lista
      // selected: Hace que sea lo primero que se ve al cargar el formulario de registro.

        <option value="" disabled selected>Selecciona un rol</option>
      // El bucle de map recorre la lista d eopciones y por cada una dibuja la opcion en el menu usando key que identifica cad elemento de la lista
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
            </option>
        ))}
      </select>
      <i className="material-symbols-rounded">expand_more</i> 
    </div>
  )
}

export default SelectField