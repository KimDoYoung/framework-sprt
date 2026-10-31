package kr.co.kfs.asseterp.biz.ics.mapper;

import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceConfirmRes;
import kr.co.kfs.asseterp.biz.ics.dto.IcsComplianceWriterRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface IcsComplianceConfirmMapper {

    /** AS-IS ics30_compliance.selectByCompanyIdPaging — 제출된 작성 내역(재직 사원). searchText는 '%…%'를 포함한 값 */
    List<IcsComplianceConfirmRes> selectPaging(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText,
                                               @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType,
                                               @Param("confirmerId") Long confirmerId, @Param("writerId") Long writerId,
                                               @Param("offset") int offset, @Param("limit") int limit);

    /** AS-IS ics30_compliance.selectByCompanyIdTotal */
    long selectTotal(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText,
                     @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType, @Param("confirmerId") Long confirmerId);

    /** AS-IS Ics30_Compliance.getConfirmYn — 내가 확인할(confirmerId) 기준 분기(월)의 미확인 건수 (검색어 '%') */
    long selectUnconfirmedCount(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText,
                                @Param("checkBox") boolean checkBox, @Param("cycleType") String cycleType, @Param("confirmerId") Long confirmerId);

    /** AS-IS ics30_compliance.selectWriterId — 내가 확인자인 확정 작성 사원 (Ics31_Lookup_SelectPerson). searchText는 '%…%'를 포함한 값 */
    List<IcsComplianceWriterRes> selectWriters(@Param("companyId") Long companyId, @Param("stdDate") LocalDate stdDate, @Param("searchText") String searchText,
                                               @Param("cycleType") String cycleType, @Param("confirmerId") Long confirmerId);

    /** AS-IS ics31_compliance_write.updateConfirmYn — 로그인 회사의 작성 행만 */
    int updateConfirmYn(@Param("companyId") Long companyId, @Param("complianceWriteId") Long complianceWriteId,
                        @Param("confirmerId") Long confirmerId, @Param("confirmYn") String confirmYn);
}
