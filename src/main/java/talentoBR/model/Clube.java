package talentoBR.model;

import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.util.UUID;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clube")
@Getter @Setter @NoArgsConstructor
public class Clube {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "data_criacao")
    private LocalDate dataCriacao = LocalDate.now();
}

