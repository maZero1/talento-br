package talentoBR.security;

import talentoBR.exception.AcessoNegadoException;
import talentoBR.model.Clube;
import talentoBR.model.User;
import talentoBR.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserProvider {
    private final UserRepository userRepository;

    public AuthenticatedUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUsuarioAtual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado: " + email));
    }

    public void validarPropriedade(Clube clube) {
        User atual = getUsuarioAtual();
        if (!clube.getId().equals(atual.getClube().getId())) {
            throw new AcessoNegadoException("Você não tem permissão sobre este recurso.");
        }
    }
}