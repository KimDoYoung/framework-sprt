package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsComplianceConfirmMapper {

    /** AS-IS ics30_compliance.selectByCompanyIdPaging — 제출된 작성 내역(재직 사원). searchText는 '%…%'를 포함한 값 */
    List<IcsComplianceConfirmRes> selectPaging(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText,
                                               @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType,
                                               @Param("offset") int offset, @Param("limit") int limit);

    /** AS-IS ics30_compliance.selectByCompanyIdTotal */
    long selectTotal(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText,
                     @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType);

    /** AS-IS ics31_compliance_write.updateConfirmYn — 로그인 회사의 작성 행만 */
    int updateConfirmYn(@Param("companyId") Long companyId, @Param("complianceWriteId") Long complianceWriteId,
                        @Param("confirmerId") Long confirmerId, @Param("confirmYn") String confirmYn);
}
