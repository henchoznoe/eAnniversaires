import Heading from "@components/heading/Heading.tsx";
import { useFetch } from "@/shared/hooks/http-hook.ts";
import useAuth from "@/shared/hooks/auth-hook.ts";
import { useEffect, useState } from "react";
import { CommunicationsDataType, GetCommunicationsType } from "@/types/communications.ts";
import Loading from "@components/loading/Loading.tsx";
import ErrorAlert from "@components/ErrorAlert.tsx";
import { CirclePlus } from "lucide-react";
import CommunicationsAccordion from "@components/accordion/CommunicationsAccordion.tsx";
import { Accordion } from "react-bootstrap";
import AddCommunicationsModal from "@components/modal/communications/AddCommunicationsModal.tsx";

const Communications = () => {

  const { sendRequest, isLoading, errors } = useFetch();
  const authCtx = useAuth();

  const [communications, setCommunications] = useState<CommunicationsDataType[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  useEffect(() => {
    // Récupérer les communications
    const fetchCommunications = async () => {
      const res: GetCommunicationsType = await sendRequest(1, 'GET', 'action=getCommunications', null, { Authorization: `Bearer ${authCtx.token}` });
      if ( res.success ) {
        setCommunications(res.data);
      }
    };
    fetchCommunications();
  }, [authCtx.token, sendRequest]);

  // Ajoute dans le tableau local la communication ajoutée
  const onCommunicationsAdded = (addedCommunications: CommunicationsDataType) => {
    setCommunications((prev) => [...prev, addedCommunications])
  }

  // Met à jour dans le tableau local la communication mise à jour
  const onCommunicationsUpdated = (updatedCommunications: CommunicationsDataType) => {
    setCommunications((prev) =>
      prev.map((com) =>
        com.pk_communication === updatedCommunications.pk_communication ? updatedCommunications : com
      )
    );
  };

  // Supprime dans le tableau local la communication supprimée
  const onCommunicationsDeleted = (deletedCommunications: CommunicationsDataType) => {
    setCommunications((prev) => prev.filter((com) => com.pk_communication !== deletedCommunications.pk_communication));
  }

  // Filtre les communications selon le filtre
  const filteredCommunications = communications.filter((com) =>
    com.description.toLowerCase().includes(filter.toLowerCase())
  );

  // Crée les accordions des communications filtrées
  const communcationsAccordions = filteredCommunications.map((com, index) => (
    <CommunicationsAccordion
      key={index}
      eventKey={com.pk_communication}
      communication={com}
      onCommunicationsUpdated={onCommunicationsUpdated}
      onCommunicationsDeleted={onCommunicationsDeleted}
    />
  ))

  // Retounre un chargement de la page si le chargement est en cours
  if ( isLoading[1] ) return <Loading/>;
  // Retourne un message d'erreur si une erreur est survenue
  if ( errors[1] ) return <ErrorAlert variant="danger">{errors[1]}</ErrorAlert>;

  return (
    <>
      <Heading title="Communications"/>
      <div className="container">
        <div className="row mb-4 d-flex justify-content-between">
          <div className="col-7 col-sm-3">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrer par description"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="col-3 d-flex justify-content-end">
            <button
              className="btn btn-teal d-flex justify-content-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              Ajouter <CirclePlus/>
            </button>
          </div>
        </div>
        <div className="row">
          {filteredCommunications.length === 0 ? (
            <ErrorAlert variant="warning">Aucune communication trouvée.</ErrorAlert>
          ) : (
            <Accordion>
              {communcationsAccordions}
            </Accordion>
          )}
        </div>
      </div>
      <AddCommunicationsModal
        showModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onAddSuccess={onCommunicationsAdded}
      />
    </>
  );
}

export default Communications;