package talentoBR.dto;

public record AuthResponse(String token, String nome, String email, String nomeClube) {
}