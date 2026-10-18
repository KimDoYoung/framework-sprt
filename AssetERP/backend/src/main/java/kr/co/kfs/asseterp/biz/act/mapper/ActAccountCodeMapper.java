package kr.co.kfs.asseterp.biz.act.mapper;

import kr.co.kfs.asseterp.biz.act.dto.AccountCodeRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/act/mapper/act01_account_code.xml — 계정코드 */
@Mapper
public interface ActAccountCodeMapper {
    /** AS-IS selectBySlipYn: 사용·전표생성 계정만 */
    List<AccountCodeRes> selectBySlipYn(@Param("companyId") Long companyId, @Param("searchText") String searchText,
                                        @Param("attributeCode") String attributeCode);
}
