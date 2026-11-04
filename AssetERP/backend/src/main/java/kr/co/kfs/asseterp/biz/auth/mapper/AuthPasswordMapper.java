package kr.co.kfs.asseterp.biz.auth.mapper;

import kr.co.kfs.asseterp.biz.auth.dto.PasswordTarget;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/sys/mapper/sys25_password.xml (check·checkPassword·checkPasswordRule·extension) + emp01_person.selectByCompanyCode */
@Mapper
public interface AuthPasswordMapper {

    /** AS-IS sys25_password.check: 회사코드·사번·휴대폰번호(하이픈 무시)가 모두 맞는 사원 (한 명일 때만 쓴다) */
    java.util.List<PasswordTarget> selectByPhone(@Param("companyCode") String companyCode, @Param("empNo") String empNo, @Param("phone") String phone);

    /** AS-IS emp01_person.selectByCompanyCode: 회사코드(sys01_loc_nm) + 사번 */
    java.util.List<PasswordTarget> selectByLoginId(@Param("companyCode") String companyCode, @Param("loginId") String loginId);

    /** AS-IS sys25_password.checkPassword: 'Y' 같음 / 'N' 다름 / null 비밀번호 행 없음 */
    String checkPassword(@Param("companyCode") String companyCode, @Param("loginId") String loginId, @Param("password") String password);

    /** 최근 비밀번호가 비어 있지 않은가 (최초·초기화 상태 판정) */
    int countCurrentPassword(@Param("personId") Long personId);

    /** AS-IS sys25_password.checkPasswordRule: 'Y' 통과, 아니면 사유 */
    String checkPasswordRule(@Param("password") String password);

    /** AS-IS sys25_password.extension: 만료 기산일(work_date)을 지금으로 */
    int extension(@Param("personId") Long personId);
}
