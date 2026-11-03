package kr.co.kfs.asseterp.biz.scm.mapper;

import kr.co.kfs.asseterp.biz.scm.dto.DeployProgramRes;
import kr.co.kfs.asseterp.biz.scm.dto.DeployRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/** AS-IS server/scm/mapper/scm11_dev_step.xml(selectByDeployPersonId·updateResultDeploy) + scm13_dev_program.xml(selectByDeployTgtDevId·updateDeploy·updateNote) (EE18) */
@Mapper
public interface ScmDeployMapper {

    /** AS-IS scm11_dev_step.selectByDeployPersonId. searchText는 '%…%', systemCode는 '%'면 전체, checkBox(전체보기)가 false면 배포대기중만 */
    List<DeployRes> selectByDeployPersonId(@Param("startDate") LocalDate startDate, @Param("closeDate") LocalDate closeDate,
                                           @Param("searchText") String searchText, @Param("systemCode") String systemCode,
                                           @Param("checkBox") boolean checkBox, @Param("personId") Long personId);

    /** AS-IS scm13_dev_program.selectByDeployTgtDevId */
    List<DeployProgramRes> selectByDeployTgtDevId(@Param("devId") Long devId);

    /** AS-IS scm13_dev_program.updateDeploy — 배포일시는 서버 시각 */
    int updateDeploy(@Param("devProgramId") Long devProgramId, @Param("deployYn") String deployYn);

    /** AS-IS scm13_dev_program.updateNote */
    int updateNote(@Param("devProgramId") Long devProgramId, @Param("note") String note);

    /** AS-IS scm11_dev_step.updateResultDeploy */
    int updateResultDeploy(@Param("devId") Long devId);
}
