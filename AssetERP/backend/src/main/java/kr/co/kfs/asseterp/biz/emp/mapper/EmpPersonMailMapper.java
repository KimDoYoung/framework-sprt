package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.EmpPersonMailRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS emp01_person.selectByPersonId / changeMail / resetMail (Emp10_Lookup_MailRetrieve, EE35) */
@Mapper
public interface EmpPersonMailMapper {

    EmpPersonMailRes selectMail(@Param("personId") Long personId);

    int changeMail(@Param("personId") Long personId, @Param("mailAddress") String mailAddress, @Param("password") String password);

    int resetMail(@Param("personId") Long personId);

    /** AS-IS sys01_company.selectById — 메일서버정보 */
    String selectMailInfo(@Param("companyId") Long companyId);
}
