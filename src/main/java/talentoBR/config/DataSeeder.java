package talentoBR.config;

import talentoBR.model.Clube;
import talentoBR.repository.ClubeRepository;
import talentoBR.model.User;
import talentoBR.repository.UserRepository;
import talentoBR.model.Time;
import talentoBR.repository.TimeRepository;
import talentoBR.model.Atleta;
import talentoBR.repository.AtletaRepository;
import talentoBR.model.Avaliacao;
import talentoBR.repository.AvaliacaoRepository;
import talentoBR.model.Estatistica;
import talentoBR.repository.EstatisticaRepository;
import talentoBR.model.LesaoHistorico;
import talentoBR.repository.LesaoHistoricoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Profile("dev") // nunca roda em prod
public class DataSeeder implements CommandLineRunner {

    private final ClubeRepository clubeRepository;
    private final UserRepository userRepository;
    private final TimeRepository timeRepository;
    private final AtletaRepository atletaRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final EstatisticaRepository estatisticaRepository;
    private final LesaoHistoricoRepository lesaoHistoricoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(ClubeRepository clubeRepository, UserRepository userRepository,
                    TimeRepository timeRepository, AtletaRepository atletaRepository,
                    AvaliacaoRepository avaliacaoRepository, EstatisticaRepository estatisticaRepository,
                    LesaoHistoricoRepository lesaoHistoricoRepository, PasswordEncoder passwordEncoder) {
        this.clubeRepository = clubeRepository;
        this.userRepository = userRepository;
        this.timeRepository = timeRepository;
        this.atletaRepository = atletaRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.estatisticaRepository = estatisticaRepository;
        this.lesaoHistoricoRepository = lesaoHistoricoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (clubeRepository.count() > 0) return;

        Clube clube = new Clube();
        clube.setNome("Escolinha Demo FC");
        clube.setDataCriacao(LocalDate.now());
        clube = clubeRepository.save(clube);

        User tecnico = new User();
        tecnico.setNome("Técnico Demo");
        tecnico.setEmail("tecnico@demo.com");
        tecnico.setPasswordHash(passwordEncoder.encode("demo123"));
        tecnico.setNomeClube(clube.getNome());
        tecnico.setClube(clube);
        tecnico = userRepository.save(tecnico);

        Time time = new Time();
        time.setClube(clube);
        time.setNome("Sub-17");
        time.setTecnico(tecnico.getNome());
        time.setModalidade("Futebol de Campo");
        time.setDescricao("Time demo pra testes");
        time = timeRepository.save(time);

        Atleta atleta = new Atleta();
        atleta.setClube(clube);
        atleta.setTime(time);
        atleta.setNome("Atleta Demo");
        atleta.setIdade(16);
        atleta.setPosicao("Meio-campo");
        atleta.setAltura(new java.math.BigDecimal("1.75"));
        atleta.setPeso(new java.math.BigDecimal("68.5"));
        atleta.setRating(new java.math.BigDecimal("7.5"));
        atleta.setEstadoForma("Apto");
        atleta = atletaRepository.save(atleta);

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setAtleta(atleta);
        avaliacao.setAvaliador(tecnico);
        avaliacao.setNotaTecnica(new java.math.BigDecimal("8.0"));
        avaliacao.setNotaTatica(new java.math.BigDecimal("7.0"));
        avaliacao.setNotaFisica(new java.math.BigDecimal("7.5"));
        avaliacao.setNotaGeral(new java.math.BigDecimal("7.5"));
        avaliacao.setParecer("Boa evolução técnica no último mês.");
        avaliacaoRepository.save(avaliacao);

        Estatistica estatistica = new Estatistica();
        estatistica.setAtleta(atleta);
        estatistica.setGols(2);
        estatistica.setAssistencias(1);
        estatistica.setDesarmes(3);
        estatistica.setPassesOk(45);
        estatistica.setPassesMal(5);
        estatistica.setDataPartida(LocalDate.now().minusDays(7));
        estatistica.setTempoJogoMin(90);
        estatisticaRepository.save(estatistica);

        LesaoHistorico lesao = new LesaoHistorico();
        lesao.setAtleta(atleta);
        lesao.setDescricao("Entorse de tornozelo leve");
        lesao.setDataInicio(LocalDate.now().minusMonths(2));
        lesao.setDataRetorno(LocalDate.now().minusMonths(1));
        lesao.setObservacoes("Recuperação completa, sem sequelas.");
        lesaoHistoricoRepository.save(lesao);

        System.out.println("Seed de dados demo aplicado com sucesso.");
    }
}