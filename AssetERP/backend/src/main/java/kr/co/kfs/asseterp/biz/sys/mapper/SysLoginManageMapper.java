package kr.co.kfs.asseterp.biz.sys.mapper;

import kr.co.kfs.asseterp.biz.sys.dto.LoginManageRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysLoginManageMapper {

    /** AS-IS sys27_login_manage.selectByText (companyId·personId는 LIKE 패턴, '%' = 전체) */
    List<LoginManageRes> selectByText(@Param("companyId") String companyId, @Param("personId") String personId);

    /** AS-IS sys27_login_manage.selectById */
    LoginManageRes selectById(@Param("loginManageId") Long loginManageId);

    /** AS-IS sys27_login_manage.updateConfirmYn */
    int updateConfirmYn(@Param("loginManageId") Long loginManageId, @Param("confirmYn") String confirmYn);

    /** AS-IS emp01_person.selectByPersonId 중 승인 문자에 쓰는 열: 휴대폰·성명 */
    PersonPhone selectPersonPhone(@Param("personId") Long personId);

    record PersonPhone(String mobileTelNo, String korNm) {
    }
}
