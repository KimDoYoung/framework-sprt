package kr.co.kfs.asseterp.biz.flt.mapper;

import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeRes;
import kr.co.kfs.asseterp.biz.flt.dto.ItemTypeSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/flt/mapper/flt05_item_type.xml + UpdateDataModel(flt05_item_type) */
@Mapper
public interface FltItemTypeMapper {
    /** AS-IS selectBySearchText (searchText는 LIKE 패턴) */
    List<ItemTypeRes> selectBySearchText(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    ItemTypeRes selectById(@Param("itemTypeId") Long itemTypeId);

    Long selectNextId();

    int insertItemType(@Param("itemTypeId") Long itemTypeId, @Param("companyId") Long companyId, @Param("req") ItemTypeSaveReq req);

    int updateItemType(@Param("companyId") Long companyId, @Param("req") ItemTypeSaveReq req);

    int deleteItemTypes(@Param("companyId") Long companyId, @Param("itemTypeIds") List<Long> itemTypeIds);

    /** AS-IS insertInitData: 고른 종목유형 한 건을 고객사로 복사 */
    int insertInitData(@Param("companyId") Long companyId, @Param("itemTypeId") Long itemTypeId);
}
