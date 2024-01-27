using System.Collections;

namespace PatientQuery.Common.Models
{
    public class CommonResponse
    {
        public bool IsError { get; set; }
        public string Message { get; set; }
        public string Description { get; set; }
        public IDictionary Data { get; set; }
    }

    public class CommonResponse<T>
    {
        public bool IsError { get; set; }
        public string Message { get; set; }
        public string Description { get; set; }
        public T Result { get; set; }
    }
}
