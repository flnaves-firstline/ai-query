using System.ComponentModel.DataAnnotations;

namespace PatientQuery.Db.Enums;

public enum FhirResourceType
{
    Patient = 1,

    Location,

    Practitioner,

    Encounter,

    Condition,

    Procedure,

    [Display(Name = "Medication request")]
    MedicationRequest,

    Observation,
}
