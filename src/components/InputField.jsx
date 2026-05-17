import { useState } from "react"

// Este prop recibe
// type: Define si el campo es de texto, email o password.
// placeholder: Es el texto gris que indica qué escribir (ej: "Email address"). icon: El nombre del icono de Google que aparecerá a la izquierda (ej: "mail" o "lock").
// id: Es fundamental para que el handleSubmit en el Login pueda identificar el valor (ej: "email").

const InputField = ({type, placeholder, icon, id, onChange}) => {
    //visualizar el icono del password con false la oculta y con true la muestra
    const [isPasswordShown, setIsPasswordShown] = useState(false);
  return (

    // Si isPasswordShown es verdadero, el tipo cambia a 'text' para que puedas ver lo que escribiste. 
    // Si es falso, usa el type original que le pasaste (que normalmente será 'password').
    // required: Asegura que el usuario no deje el campo vacío antes de intentar registrarse o loguearse.

        <div className="input-wrapper">
            <input 
            id={id}
            name={id}
            type={isPasswordShown ? 'text' : type}
            placeholder={placeholder}
            className="input-field" 
            onChange={onChange}
            required>
            </input>
            {/* Este es el icono decorativo de la izquierda (el sobrecito o el candado) */}
            <i className="material-symbols-rounded">{icon}</i>
            {/* Esta es una "puerta lógica". Dice: "Solo dibuja lo que sigue si este input es de tipo password". Por eso el icono del ojo no aparece en el campo de Email. */}
            {type === 'password' && (
            // Al hacer clic, setIsPasswordShown cambia el valor al opuesto (de true a false y viceversa).
                <i onClick={() => setIsPasswordShown(prevState => ! prevState)} className="material-symbols-rounded eye-icon">
            {/* Cambia entre 'visibility' (un ojo abierto) y 'visibility_off' (un ojo tachado) para darle feedback visual al usuario */}
                    {isPasswordShown ? 'visibility' : 'visibility_off'}
                </i>
            )}
        </div>
  )
}

export default InputField