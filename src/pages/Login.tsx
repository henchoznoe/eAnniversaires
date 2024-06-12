import { useForm } from 'react-hook-form';
import { useFetch } from "@/shared/hooks/http-hook.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Form, Spinner } from "react-bootstrap";
import { toast } from "sonner";
import { LoginType } from "@/types/login.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useNavigate } from "react-router-dom";
import { LoginFormData, loginSchema } from "@/constants/schemas/login.ts";

const Login = () => {

  const navigate = useNavigate();
  const { sendRequest, isLoading, errors } = useFetch();
  const authCtx = useAuth();
  const { register, handleSubmit, formState: { errors: formErrors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const loginHandler = async (data: LoginFormData) => {
    // Envoyer la requête de connexion au serveur
    const res: LoginType = await sendRequest(1, 'POST', null, JSON.stringify({ action: 'login', ...data }));
    // Vérifier si la requête a réussi
    if ( res.success ) {
      toast.success(`Bienvenue ${res.data.mail}`)
      authCtx.login(res.data.token, res.data.expiresAt);
      // Rediriger vers la page d'accueil
      navigate('/');
    }
  };

  return (
    <div className="d-flex justify-content-center pt-5 px-3">
      <div className="shadow-lg rounded-4 p-4 bg-white" style={{ width: '400px' }}>
        <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit(loginHandler)}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Votre adresse e-mail"
              {...register('mail')}
              isInvalid={!!formErrors.mail}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.mail?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Votre mot de passe"
              {...register('password')}
              isInvalid={!!formErrors.password}
            />
            <Form.Control.Feedback type="invalid" className="d-block">
              {formErrors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <button className="btn btn-teal" type="submit" disabled={isLoading[1]}>
            {isLoading[1] ? (
              <div className="d-flex gap-2 align-items-center justify-content-center">
                <span>Chargement...</span>
                <Spinner animation="border" size="sm"/>
              </div>
            ) : ('Se connecter')}
          </button>

          {errors[1] && <Alert variant="danger">{errors[1]}</Alert>}
        </Form>
      </div>
    </div>
  );
};

export default Login;