package talentoBR.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import talentoBR.config.JwtService;
import talentoBR.dto.AuthResponse;
import talentoBR.dto.LoginRequest;
import talentoBR.dto.RegisterRequest;
import talentoBR.exception.CredenciaisInvalidasException;
import talentoBR.exception.EmailJaCadastradoException;
import talentoBR.model.User;
import talentoBR.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException("Este e-mail já está cadastrado.");
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(req.password())) // nunca salvamos a senha em texto puro
                .nome(req.nome().trim())
                .nomeClube(req.nomeClube().trim())
                .build();

        userRepository.save(user);

        String token = jwtService.gerarToken(user.getEmail());
        return new AuthResponse(token, user.getNome(), user.getEmail());
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CredenciaisInvalidasException("E-mail ou senha incorretos."));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new CredenciaisInvalidasException("E-mail ou senha incorretos.");
        }

        String token = jwtService.gerarToken(user.getEmail());
        return new AuthResponse(token, user.getNome(), user.getEmail());
    }
}