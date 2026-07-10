package talentoBR.service;

import talentoBR.dto.AuthResponse;
import talentoBR.dto.LoginRequest;
import talentoBR.dto.RegisterRequest;
import talentoBR.exception.CredenciaisInvalidasException;
import talentoBR.exception.EmailJaCadastradoException;
import talentoBR.config.JwtService;
import talentoBR.model.Clube;
import talentoBR.model.User;
import talentoBR.repository.ClubeRepository;
import talentoBR.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final ClubeRepository clubeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, ClubeRepository clubeRepository,
                        PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.clubeRepository = clubeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException("E-mail já cadastrado: " + email);
        }

        Clube clube = new Clube();
        clube.setNome(req.nomeClube().trim());
        clube.setDataCriacao(LocalDate.now());
        clube = clubeRepository.save(clube);

        User user = User.builder()
            .email(email)
            .passwordHash(passwordEncoder.encode(req.password()))
            .nome(req.nome().trim())
            .nomeClube(req.nomeClube().trim())
            .clube(clube)
            .build();

        userRepository.save(user);

        String token = jwtService.gerarToken(user.getEmail());
        return new AuthResponse(token, user.getNome(), user.getEmail(), clube.getNome());
    }

    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new CredenciaisInvalidasException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new CredenciaisInvalidasException("E-mail ou senha inválidos.");
        }

        String token = jwtService.gerarToken(user.getEmail());
        String nomeClube = user.getClube() != null ? user.getClube().getNome() : user.getNomeClube();
        return new AuthResponse(token, user.getNome(), user.getEmail(), nomeClube);
    }
}