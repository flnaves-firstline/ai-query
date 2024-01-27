namespace PatientQuery.Core.External.OpenAi;

public class DummyAiService : IAiService
{
    public async Task<Message?> GetChatResponse(List<Message> messages, OpenAiRequestModel settings)
    {
        await Task.Delay(1000);
        if (Random.Shared.Next() % 3 == 0)
            throw new Exception("DummyAI Chat API is not available");
        return new Message { Role = Role.Assistant, Content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo doloremque repudiandae sapiente eligendi culpa quis ullam praesentium! Quisquam, accusantium totam veniam magni vel tenetur, fuga odio et quod facilis voluptatibus!" };
    }
}
