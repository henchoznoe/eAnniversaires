import { Alert, Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { homeCards } from "@/constants/homepage/home-cards.ts";
import { useEffect, useState } from "react";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import {
  AdminBirthdaysDataType,
  BirthdaysDataType,
  GetAdminBirthdaysType,
  GetBirthdaysType
} from "@/types/birthdays.ts";
import { dateFormatMedium, formatShortDates } from "@/utils/date-format.ts";

const Homepage = () => {

  const authCtx = useAuth();
  const { sendRequest, isLoading, errors } = useFetch();

  const [birthdays, setBirthdays] = useState<BirthdaysDataType[]>([]);
  const [adminBirthdays, setAdminBirthdays] = useState<AdminBirthdaysDataType[]>([]);

  useEffect(() => {
    // Récupérer les anniversaires du mois
    const fetchMonthsBirthdays = async () => {
      const res: GetBirthdaysType = await sendRequest(1, 'GET', 'action=getMonthsBirthdays', null);
      if ( res.success && res.data ) {
        setBirthdays(res.data);
      }
    }
    // Récupérer les anniversaires de mois pour les administrateurs
    const fetchAdminMonthsBirthdays = async () => {
      const res: GetAdminBirthdaysType = await sendRequest(1, 'GET', 'action=getAdminMonthsBirthdays', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success && res.data ) {
        setAdminBirthdays(res.data);
      }
    }
    authCtx.isAuthenticated ? fetchAdminMonthsBirthdays() : fetchMonthsBirthdays();
  }, [authCtx.isAuthenticated, authCtx.token, sendRequest]);

  // Permet de régler une erreur TypeScript dans le "return" du composant
  const isAdminBirthday = (birthday: BirthdaysDataType): birthday is AdminBirthdaysDataType => {
    return !(birthday as AdminBirthdaysDataType).isAdmin;
  }

  return (
    <Container className="pt-4 d-flex flex-column gap-md-5 gap-3">
      <div className="text-center">
        <h1 className="display-4">Bienvenue sur eAnniversaires&nbsp;!</h1>
        <p className="lead">Nous célébrons ici les anniversaires de nos talentueux collaborateurs.</p>
      </div>
      <Row>
        {homeCards.map((card, index) => (
          <HomeCard key={index} title={card.title} text={card.text}/>
        ))}
      </Row>
      <Row>
        <Col lg={authCtx.isAuthenticated ? 12 : 6} md={12}>
          <p className="lead text-justify">
            Découvrez sans plus attendre la liste des collaborateurs ayant leur anniversaire ce mois-ci. Que
            ce soit une année de plus, un anniversaire spécial ou une étape dans leur carrière, prenons un moment
            pour les féliciter et leur montrer notre reconnaissance !
          </p>
        </Col>
        <Col lg={authCtx.isAuthenticated ? 12 : 6} md={12}>
          {isLoading[1] ? (
            <div className="d-flex flex-column align-items-center gap-2">
              <Spinner animation="border" role="status">
                <span className="visually-hidden"></span>
              </Spinner>
              <span>Chargement...</span>
            </div>
          ) : (
            <>
              {errors[1] ? (
                <Alert variant="danger">{errors[1]}</Alert>
              ) : (
                <>
                  {(authCtx.isAuthenticated ? adminBirthdays : birthdays).length === 0 ? (
                    <Alert variant="warning">Aucun anniversaire trouvé ce mois-ci.</Alert>
                  ) : (
                    <Table bordered>
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Date</th>
                          <th>Type</th>
                          {authCtx.isAuthenticated && (
                            <>
                              <th>Adresse mail</th>
                              <th>Numéro de téléphone</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {(authCtx.isAuthenticated ? adminBirthdays : birthdays).map((birthday, index) => {
                          const today = new Date();
                          let birthdayIsToday = false;
                          if (authCtx.isAuthenticated) {
                            const birthdayDate = new Date(birthday.birthday_date);
                            birthdayIsToday = birthdayDate.toDateString() === today.toDateString();
                          } else {
                            const [day, month] = birthday.birthday_date.split('-');
                            if (month && day) {
                              const todayMonthDay = today.toISOString().slice(5, 10);
                              birthdayIsToday = `${month.padStart(2, '0')}-${day.padStart(2, '0')}` === todayMonthDay;
                            }
                          }
                          return (
                            <tr key={index} className={birthdayIsToday ? 'table-warning' : ''}>
                              <td>{birthday.first_name} {birthday.last_name}</td>
                              <td>{authCtx.isAuthenticated ? dateFormatMedium(birthday.birthday_date) : formatShortDates(birthday.birthday_date)}</td>
                              <td>{birthday.birthday_type}</td>
                              {authCtx.isAuthenticated && isAdminBirthday(birthday) && (
                                <>
                                  <td>{birthday.mail}</td>
                                  <td>{birthday.tel_number}</td>
                                </>
                              )}
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  )}
                </>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

type HomeCardProps = {
  title: string;
  text: string;
}

const HomeCard = (props: HomeCardProps) => {
  return (
    <Col md={4} className="mb-4">
      <Card className="shadow-sm h-100">
        <Card.Body className="d-flex flex-column gap-2">
          <Card.Title className="text-center">{props.title}</Card.Title>
          <Card.Text className="text-justify">{props.text}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Homepage;